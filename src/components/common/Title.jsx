

const Title = ({name, namebold}) => {
  return (
    <h2 className="font-normal text-primary text-center text-[35px]">{name} <span className="font-bold">{namebold}</span></h2>
  )
}

export default Title