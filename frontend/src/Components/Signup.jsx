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
import { userSignup } from "../Redux/Auth/action";
import { useDispatch, useSelector } from "react-redux";
import { RAZORPAY, CHECK_USER } from "../Utils/api";
import axios from "axios";

const loadScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const Signup = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    username: "",
    email: "",
    phone_number: "",
    password: "",
    confirm_password: "",
  });
  const dispatch = useDispatch();
  const toast = useToast();
  const navigate = useNavigate();

  const isLoading = useSelector((state) => state.AuthReducer.isLoading);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      toast({
        title: "Razorpay SDK failed to load. Are you online ?",
        status: "error",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    const fdata = await fetch(RAZORPAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
    }).then((res) => res.json());

    const options = {
      key: "rzp_test_sQ3azqtorW8osX",
      currency: fdata.currency,
      amount: fdata.amount,
      order_id: fdata.id,
      name: "Pay Money",
      description: "Please donate us some money",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      handler: function (response) {
        const payload = {
          currency: fdata.currency,
          amount: fdata.amount,
          order_id: fdata.id,
          payment_id: response.razorpay_payment_id,
        };

        dispatch(userSignup({ ...data, ...payload })).then((res) => {
          if (res.payload.status === "success") {
            toast({
              title: res.payload.message,
              status: "success",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            navigate("/login");
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
      },
      prefill: {
        name: data.username,
        email: data.email,
        contact: data.phone_number,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(data.phone_number.length);

    if (
      data.username == "" ||
      data.email == "" ||
      data.phone_number == "" ||
      data.password == "" ||
      data.confirm_password == ""
    ) {
      toast({
        title: "Please filed all the fields",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else if (data.phone_number.length < 10 || data.phone_number.length > 10) {
      toast({
        title: "Please enter correct phone number",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else if (data.password !== data.confirm_password) {
      toast({
        title: "Passwords and confirm password should be same",
        status: "info",
        duration: 2000,
        isClosable: true,
        position: "top",
      });
    } else {
      await axios
        .post(CHECK_USER, data)
        .then((res) => {
          if (res.data.status === "info") {
            toast({
              title: res.data.message,
              status: "info",
              duration: 2000,
              isClosable: true,
              position: "top",
            });
            navigate("/login");
          } else {
            displayRazorpay();
          }
        })
        .catch((err) => console.log(err));
    }
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
          pt={"100px"}
          w={"450px"}
          maxWidth={"100%"}
          h={"100vh"}
          backgroundImage={boxImage}
          backgroundRepeat={"no-repeat"}
          backgroundSize={"cover"}
          backgroundPosition={"center"}
        >
          <Heading fontSize={"25px"} color={"white"}>
            Sign Up
          </Heading>

          <FormControl isRequired>
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
              type="text"
              placeholder="User Name* "
              name="username"
              onChange={handleChange}
            />
            <Input
              mt={4}
              pl={1}
              variant="flushed"
              color={"white"}
              borderBottom={"1px solid #4e7650"}
              _placeholder={{
                color: "#9e9e9e",
                fontWeight: 500,
              }}
              placeholder="Email* "
              type="email"
              name="email"
              onChange={handleChange}
            />

            <Input
              mt={4}
              pl={1}
              variant="flushed"
              color={"white"}
              borderBottom={"1px solid #4e7650"}
              _placeholder={{
                color: "#9e9e9e",
                fontWeight: 500,
              }}
              type="number"
              placeholder="Phone No.*"
              name="phone_number"
              onChange={handleChange}
            />

            <Input
              mt={4}
              pl={1}
              variant="flushed"
              color={"white"}
              borderBottom={"1px solid #4e7650"}
              _placeholder={{
                color: "#9e9e9e",
                fontWeight: 500,
              }}
              type="password"
              placeholder="Password*"
              name="password"
              onChange={handleChange}
            />

            <InputGroup>
              <Input
                mt={4}
                pl={1}
                variant="flushed"
                color={"white"}
                borderBottom={"1px solid #4e7650"}
                _placeholder={{
                  color: "#9e9e9e",
                  fontWeight: 500,
                }}
                type={showPassword ? "text" : "password"}
                placeholder="Confirm Password*"
                name="confirm_password"
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

          <Flex justifyContent={"center"}>
            <Button
              onClick={handleSubmit}
              w="150px"
              mt={5}
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
                "Sign Up"
              )}
            </Button>
          </Flex>

          <Flex
            fontSize={"14px"}
            color={"white"}
            justifyContent={"center"}
            mt={5}
            gap={1}
          >
            Already have an account ?
            <Link to={"/login"}>
              <Text color={"#4e7650"}>Login</Text>
            </Link>
          </Flex>
        </Box>
      </Flex>
    </>
  );
};
