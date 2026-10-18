import { useEffect, useState } from "react";
import Title from "../common/Title"
import axios from "axios";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation } from 'swiper/modules';
import Product from "../common/Product";
import { FaAngleLeft , FaAngleRight } from "react-icons/fa";




const LimitedEdition = () => {

    let [products, setProducts] = useState([]);


useEffect(() => {
    axios.get("https://dummyjson.com/products?limit=10").then((res) => {
setProducts(res.data.products)
  }).catch((err) => {
    console.log(err);
  })
}, []);


  return (
    <section>
      <div className="container relative ">
       <Title name="LIMITED" namebold="EDITION" />
       <div>
        <Swiper slidesPerView={4} modules={[Navigation]} className="mySwiper" navigation={{
            nextEl: '.next-button',
            prevEl: '.prev-button',
        }} >
            {products.map((item) => (
                <SwiperSlide >
                    <Product item={item} key={item.id} />
                </SwiperSlide>
            ))}
        </Swiper>
        
        <div className="slideBtn">

            <button className="prev-button absolute top-2/4 translate-y-[50%] -left-5">
                <FaAngleLeft size={25} className="text-gray"/>
            </button>
            <button className="next-button absolute top-2/4 translate-y-[50%] -right-5">
                <FaAngleRight size={25} className="text-gray"/>
            </button>

        </div>


       </div>
      </div>
    </section>
  )
}

export default LimitedEdition