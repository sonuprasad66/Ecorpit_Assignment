import React, { useState } from "react";
import {
  Box,
  Button,
  Flex,
  FormControl,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useToast,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import backgroundImage from "../assets/backgroundImage.svg";
import boxImage from "../assets/boxImage.svg";
import { Link, useNavigate } from "react-router-dom";
import { userLogin } from "../Redux/Auth/action";
import { useDispatch, useSelector } from "react-redux";

export const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({});
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.AuthReducer.isLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    dispatch(userLogin(data)).then((res) => {
      if (res.payload.status === "success") {
        localStorage.setItem("token", res.payload.token);
        toast({
          title: res.payload.message,
          status: "success",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
        navigate("/");
      } else {
        toast({
          title: res.payload.message,
          status: "error",
          duration: 2000,
          isClosable: true,
          position: "top",
        });
      }
    });
  };

  return (
    <>
      <Flex
        w={"100%"}
        h={"100vh"}
        p={"150px 0"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundImage={backgroundImage}
      >
        <Box
          borderRadius={"50px"}
          p={8}
          pt={"150px"}
          w={"450px"}
          maxWidth={"100%"}
          h={"100vh"}
          backgroundImage={boxImage}
          backgroundRepeat={"no-repeat"}
          backgroundSize={"cover"}
          backgroundPosition={"center"}
        >
          <Heading fontSize={"25px"} color={"white"}>
            Login
          </Heading>

          <FormControl isRequired>
            <Input
              mt={10}
              pl={1}
              variant="flushed"
              color={"white"}
              borderBottom={"1px solid #4e7650"}
              _placeholder={{
                color: "#9e9e9e",
                fontWeight: 500,
              }}
              type="number"
              placeholder="Enter Phone No.*"
              name="phone_number"
              onChange={handleChange}
            />

            <InputGroup>
              <Input
                mt={7}
                pl={1}
                variant="flushed"
                color={"white"}
                borderBottom={"1px solid #4e7650"}
                _placeholder={{
                  color: "#9e9e9e",
                  fontWeight: 500,
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Enter Password*"
                name="password"
                onChange={handleChange}
              />
              <InputRightElement h={"full"}>
                <Button
                  bg={"none"}
                  _hover={"none"}
                  onClick={() =>
                    setShowPassword((showPassword) => !showPassword)
                  }
                >
                  {showPassword ? (
                    <ViewOffIcon color={"gray"} />
                  ) : (
                    <ViewIcon color={"gray"} />
                  )}
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>

          <Text textAlign={"right"} color={"#a13044"} mt={4}>
            <Link>Forgot Password?</Link>
          </Text>

          <Flex justifyContent={"center"}>
            <Button
              onClick={handleSubmit}
              w="150px"
              mt={10}
              bg={"#4e7650"}
              color={"white"}
              fontWeight={600}
              _hover={{
                bg: "white",
                color: "#4e7650",
              }}
            >
              {isLoading ? (
                <>
                  <Spinner
                    thickness="4px"
                    speed="0.65s"
                    emptyColor="gray.200"
                    color="4e7650"
                    size="md"
                  />
                </>
              ) : (
                "Login"
              )}
            </Button>
          </Flex>

          <Flex
            fontSize={"14px"}
            color={"white"}
            justifyContent={"center"}
            mt={"40px"}
            gap={1}
          >
            Don`t have an account ?
            <Link to={"/signup"}>
              <Text color={"#4e7650"}>Sign Up</Text>
            </Link>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
