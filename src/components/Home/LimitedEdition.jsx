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
    <section className="mb-12.5 lg:mb-20.75">
      <div className="container relative ">
       <Title name="LIMITED" namebold="EDITION"  />
       <div className="bg-gray-100 pt-2.25 lg:pt-0">
        <Swiper  modules={[Navigation]} className="mySwiper" navigation={{
            nextEl: '.next-button',
            prevEl: '.prev-button',
        }}
        


        breakpoints={{
           
            320: {
              slidesPerView: 2,
              spaceBetween: 10,
             
            },
    
            768: {
              slidesPerView: 3,
            
            },
          
            1024: {
              slidesPerView: 4,
            },
        }}
        
        >
            {products.map((item) => (
                <SwiperSlide >
                    <Product item={item} key={item.id} />
                </SwiperSlide>
            ))}
        </Swiper>
        
        <div className="slideBtn">

            <button className="prev-button absolute top-2/4 translate-y-[20%] lg:translate-y-[50%] left-0 -lg:left-5 z-50 rounded-full bg-white border border-gray">
                <FaAngleLeft size={50} className="text-gray"/>
            </button>
            <button className="next-button absolute top-2/4 translate-y-[20%] lg:translate-y-[50%] right-0 -lg:left-5 z-50 rounded-full bg-white border border-gray">
                <FaAngleRight size={50} className="text-gray"/>
            </button>

        </div>


       </div>
      </div>
    </section>
  )
}

export default LimitedEdition