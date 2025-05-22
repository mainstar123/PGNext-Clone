import { FunctionComponent } from "react"
import { FaRegStar, FaStar } from "react-icons/fa"

interface FollowButtonTextProps {
  isFollowing: boolean
  playerName: string
}

const FollowButtonText: FunctionComponent<FollowButtonTextProps> = ({
  isFollowing,
  playerName,
}) => {
  return (
    <>
      <span className="px-1">
        {isFollowing ? (
          <FaStar className="follow-icon" />
        ) : (
          <FaRegStar className="follow-icon" />
        )}
      </span>
      {`${isFollowing ? `Following` : `Follow`} ${playerName}`}
    </>
  )
}

export default FollowButtonText
