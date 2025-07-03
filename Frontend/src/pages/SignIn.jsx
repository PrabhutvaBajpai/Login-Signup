import React, { useState } from "react";
import { Button, Input, Stack, Box, Text, Spinner } from "@chakra-ui/react";
import { Field } from "../components/ui/field";
import { Link, useNavigate } from "react-router-dom";

function SignIn() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5001/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password: pass }),
      });

      const data = await response.json();
      console.log('✅ SignIn Response:', data);

      if (response.ok && data.response?.status === 'successful') {
        alert('🎉 Sign in successful!');
        navigate('/dashboard');  // adjust this route as needed
      } else {
        alert(data.message || 'Invalid email or password.');
      }
    } catch (err) {
      console.error('❌ Error during sign in:', err);
      alert(`Something went wrong: ${err.message}`);
    } finally {
      setLoading(false);
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
          Sign In
        </Text>
        <Text fontSize="sm" color="gray.400" mb={4}>
          Enter your credentials to access your account.
        </Text>

        <form onSubmit={submit}>
          <Stack spacing={4}>
            <Field label="Email">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </Field>
            <Field label="Password">
              <Input
                type="password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                placeholder="Enter your password"
              />
            </Field>

            {loading && (
              <Stack align="center">
                <Spinner size="sm" color="blue.300" />
                <Text color="gray.300">Signing in...</Text>
              </Stack>
            )}

            <Stack direction="row" justify="flex-end">
              <Button variant="outline" type="button" onClick={() => navigate('/')}>
                Cancel
              </Button>
              <Button type="submit" colorScheme="blue" isDisabled={loading || !email || !pass}>
                Sign In
              </Button>
            </Stack>

            <Link to="/forgotPassword">
              <Text fontSize="sm" color="blue.300" mb={4} _hover={{ textDecoration: 'underline' }}>
                Forgot Password?
              </Text>
            </Link>
          </Stack>
        </form>
      </Box>
    </Box>
  );
}

export default SignIn;
