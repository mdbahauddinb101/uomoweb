
import bannerdata from "../../api/bannerdata.json"
import Image from "../common/Image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";


import 'swiper/css/pagination';
import { Pagination } from "swiper/modules";

const Banner = () => {



  return (
   <section className="mx-5 mt-4.75"> 


<Swiper pagination={{clickable: true}} modules={[Pagination]} className="mySwiper ">
        {bannerdata.map((item) => (
 <SwiperSlide>
    <Image className="w-full"  src={item.image} alt="banner" />
</SwiperSlide>
     
))}
 </Swiper>



   </section>
  )
}

export default Banner