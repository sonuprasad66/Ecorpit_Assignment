import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
  useToast,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import backgroundImage from "../assets/backgroundImage.svg";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../Redux/Auth/action";
import { RAZORPAY } from "../Utils/api";

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

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();
  const currentUser = useSelector((state) => state.AuthReducer.currentUser);

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/login");
    } else {
      dispatch(getProfile());
    }
  }, []);

  const handleLogout = () => {
    const token = localStorage.removeItem("token");
    navigate("/login");
  };

  const displayRazorpay = async () => {
    const res = await loadScript(
      "https://checkout.razorpay.com/v1/checkout.js"
    );

    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    const data = await fetch(RAZORPAY, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      mode: "cors",
      body: JSON.stringify({ user_id: currentUser._id }),
    }).then((res) => res.json());

    console.log(data);

    const options = {
      key: "rzp_test_sQ3azqtorW8osX",

      // key: "rzp_test_J2fkwlHoSWVpJF",

      currency: data.currency,
      amount: data.amount,
      order_id: data.id,
      name: "Pay Money",
      description: "Please donate us some money",
      image: "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
      handler: function (response) {
        toast({
          title: `Your Payment ID is : ${response.razorpay_payment_id}`,
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "top",
        });
      },
      prefill: {
        name: currentUser.username,
        email: currentUser.email,
        phone_number: currentUser.phone_number,
      },
    };
    const paymentObject = new window.Razorpay(options);
    paymentObject.open();
  };

  return (
    <>
      <Flex
        w={"100%"}
        h={"100vh"}
        justifyContent={"center"}
        alignItems={"center"}
        backgroundImage={backgroundImage}
      >
        <Flex
          p={5}
          borderRadius={4}
          w={"350px"}
          h={"400px"}
          bg={"#000000"}
          color={"white"}
          flexDirection={"column"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <Box
            border={"2px solid #4e7650"}
            w={"150px"}
            h={"150px"}
            p={4}
            borderRadius={"50%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Image
              w={"100%"}
              h={"100%"}
              src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            />
          </Box>
          <Box mt={2}>
            <Heading fontSize={"25px"}>Name : {currentUser.username}</Heading>
            <Text>Mobile : {currentUser.phone_number}</Text>
            <Text>Email : {currentUser.email}</Text>
          </Box>

          <Flex mt={5} gap={5}>
            <Button
              w="120px"
              bg={"#4e7650"}
              color={"white"}
              fontWeight={600}
              _hover={{
                bg: "white",
                color: "#4e7650",
              }}
              onClick={handleLogout}
            >
              Logout
            </Button>
            <Button
              w="120px"
              bg={"#4e7650"}
              color={"white"}
              fontWeight={600}
              _hover={{
                bg: "white",
                color: "#4e7650",
              }}
              onClick={displayRazorpay}
            >
              Pay 1
            </Button>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
};
