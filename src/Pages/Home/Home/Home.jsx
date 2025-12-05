import React from "react";
import Banner from "../Banner/Banner";
import Category from "../Category/Category";
import CallToAction from "../CallToAction/CallToAction";
import Review from "../Review/Review";
import ContactUs from "../ContactUs/ContactUs";

const Home = () => {
  return (
    <>
      <Banner></Banner>
      <Category></Category>
      {/* <FeaturedSection></FeaturedSection> */}
      <CallToAction></CallToAction>
      <Review></Review>

      <ContactUs></ContactUs>
    </>
  );
};

export default Home;
