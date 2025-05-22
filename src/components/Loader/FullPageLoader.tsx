import { ThreeDots } from "react-loader-spinner"

const FullPageLoader = () => {
  return (
    <>
      <div className="fullPageLoaderContainer" />
      <div className="fullPageLoader">
        <ThreeDots
          height="80"
          width="80"
          radius="9"
          color="#4fa94d"
          ariaLabel="three-dots-loading"
          visible={true}
        />
      </div>
    </>
  )
}

export default FullPageLoader
