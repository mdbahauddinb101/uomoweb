
import Banner from "../components/Home/Banner";
import Category from "../components/Home/Category";
import Features from "../components/Home/Features";
import LimitedEdition from "../components/Home/LimitedEdition";
import Logos from "../components/Home/Logos";
import SpringCollection from "../components/Home/SpringCollection";
import Starting from "../components/Home/Starting";
import TrendyProducts from "../components/Home/TrendyProducts";

const HomePage = () => {
  return (
    <>
    <Banner />
    <Category />
    <TrendyProducts />
    <SpringCollection />
    <Starting />
    <LimitedEdition />
    {/* <Logos />
    <Features /> */}
    </>
  )
  
};

export default HomePage;
