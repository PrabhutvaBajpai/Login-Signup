import React, { useState, useEffect } from "react";
import { Box, Button, Input, Stack, Text } from "@chakra-ui/react";
import { Field } from "../components/ui/field";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [step, setStep] = useState(0); // 0: email, 1: sending, 2: enter OTP, 3: reset password
  const [timeLeft, setTimeLeft] = useState(300);

  // Timer effect
  useEffect(() => {
    if (step !== 2) return;

    const timerId = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerId);
          handleOtpExpire();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [step]);

  const handleOtpExpire = async () => {
    try {
      await fetch("http://localhost:5002/deleteOneOtp", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      console.log("🔔 OTP expired and deleted");
    } catch (error) {
      console.error("❌ Error deleting OTP:", error);
    } finally {
      setStep(0);
      setTimeLeft(300);
      setOtp("");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `Valid Time : ${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const sendOtp = async () => {
    setStep(1); // indicate processing

    try {
      // ➡️ Check if email exists
      const checkResponse = await fetch(`http://localhost:5001/user/${email}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      if (checkResponse.status === 404) {
        alert("No account found with this email. Please register first.");
        setStep(0);
        return;
      }

      if (!checkResponse.ok) {
        throw new Error("Failed to check email");
      }

      console.log("✅ Email exists in database. Proceeding to send OTP.");

      // ➡️ Now send OTP
      const response = await fetch("http://localhost:5002/sendOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      console.log("🔹 OTP API Response:", data);

      if (data?.response?.status === "successful") {
        setStep(2);
      } else {
        alert("Failed to send OTP.");
        setStep(0);
      }
    } catch (error) {
      console.error("❌ Error sending OTP:", error);
      alert("Something went wrong. Please try again.");
      setStep(0);
    }
  };

  const validateOTP = async () => {
    try {
      const response = await fetch("http://localhost:5002/validateOtp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      const data = await response.json();
      console.log("🔹 Validation Response:", data.response.status);

      if (data.response.status === "successful") {
        setStep(3);
        alert("OTP verified successfully!");
      } else {
        alert("Invalid OTP. Please try again.");
        setStep(2);
      }
    } catch (error) {
      console.error("❌ Error validating OTP:", error);
      setStep(2);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/resetPassword", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("✅ Password Reset Response:", data);

      if (response.status === 200) {
        alert("🔒 Password reset successful!");
        setStep(0);
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setOtp("");
        setTimeLeft(300);
      } else {
        alert("Reset failed: " + data.message);
      }
    } catch (error) {
      console.error("❌ Error resetting password:", error);
      alert(`Something went wrong: ${error.message}`);
    }
  };

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      height="100vh"
      bg="black"
    >
      <Box
        maxW="sm"
        w="full"
        p={6}
        boxShadow="lg"
        borderRadius="md"
        bg="gray.900"
        border="1px solid white"
      >
        <Text fontSize="2xl" fontWeight="bold" mb={1} color="white">
          Forgot Password
        </Text>
        <Text fontSize="sm" color="gray.400" mb={4}>
          Enter your registered email to reset your password.
        </Text>

        <form onSubmit={resetPassword}>
          <Stack spacing={4}>
            {step === 0 && (
              <>
                <Field label="Email">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                </Field>
                <Button onClick={sendOtp} isDisabled={!email}>
                  Send OTP
                </Button>
              </>
            )}

            {step === 1 && <Text color="white">🔄 OTP is being sent...</Text>}

            {step === 2 && (
              <>
                <Field
                  label={`OTP                          ${formatTime(timeLeft)}`}
                >
                  <Input
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter OTP"
                  />
                </Field>
                <Button onClick={validateOTP} isDisabled={!otp}>
                  Verify OTP
                </Button>
              </>
            )}

            {step === 3 && (
              <>
                <Field label="New Password">
                  <Input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </Field>

                <Field label="Confirm Password">
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                  />
                </Field>

                <Stack direction="row" justify="flex-end">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => setStep(0)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" colorScheme="blue">
                    Reset Password
                  </Button>
                </Stack>
              </>
            )}
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default ForgotPassword;
