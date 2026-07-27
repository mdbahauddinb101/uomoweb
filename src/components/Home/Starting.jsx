import Image from "../common/Image"
import StartingImage from "../../assets/imagestarting.png";

const Starting = () => {
  return (
    <section>
        <div className="container">
            <div className="flex justify-between mt-25">
                <div className="h-99.5 w-172.5 relative ">
                    <Image className="w-full h-full" src={StartingImage} alt="images" />  
                    <div className="group absolute top-0 left-0 w-full h-full flex items-end duration-500 opacity-80  hover:bg-red-500 ">
                       <div className="mb-12.5 ml-12.5">
                         <h3 className="text-primary text-lg font-medium group-hover:text-white">STARTING AT $19</h3>
                        <h2 className="text-primary text-[26px] font-medium group-hover:text-white">Women’s T-Shirts</h2>
                        <button className="group-hover:text-white text-primary after:bg-[white] relative cursor-pointer text-sm leading-6 font-medium uppercase after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">
              Shop Now
            </button>
                       </div>
                    </div>
                    

                </div>

                <div className="h-99.5 w-172.5 relative ">
                    <Image className="w-full h-full" src={StartingImage} alt="images" />  
                    <div className="group absolute top-0 left-0 w-full h-full flex items-end duration-500 opacity-80  hover:bg-red-500 ">
                       <div className="mb-12.5 ml-12.5">
                         <h3 className="text-primary text-lg font-medium group-hover:text-white">STARTİNG AT $39</h3>
                        <h2 className="text-primary text-[26px] font-medium group-hover:text-white">Men’s Sportswear</h2>
                        <button className="group-hover:text-white text-primary after:bg-[white] relative cursor-pointer text-sm leading-6 font-medium uppercase after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-0 after:duration-500 after:content-[''] hover:after:w-full">
              Shop Now
            </button>
                       </div>
                    </div>
                    

                </div>

            </div>
        </div>
    </section>
  )
}

export default Starting