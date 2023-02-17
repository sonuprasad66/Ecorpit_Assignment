import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Text,
} from "@chakra-ui/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import backgroundImage from "../assets/backgroundImage.svg";
import { useNavigate } from "react-router-dom";
import { getProfile } from "../Redux/Auth/action";

export const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
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
          <Button
            w="150px"
            mt={5}
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
        </Flex>
      </Flex>
    </>
  );
};
