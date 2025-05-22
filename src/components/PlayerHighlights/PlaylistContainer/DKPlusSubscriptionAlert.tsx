import { FunctionComponent, useEffect, useState } from "react"
import { Modal, Tab, Tabs } from "react-bootstrap"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/router"
import { useAuth } from "@/context/auth"

interface DKPlusSubscriptionAlertProps {
  modelCloseHandler: () => void
}

const DKPlusSubscriptionAlert: FunctionComponent<
  DKPlusSubscriptionAlertProps
> = ({ modelCloseHandler }) => {
  const user = useAuth().user
  const router = useRouter()
  const [playerId, setPlayerId] = useState("0")
  const [selectedPlanType, setSelectedPlanType] = useState("annual") // monthly

  const { hst } = router.query
  const domain = hst
  const { isAuthenticated } = useAuth()

  useEffect(() => {
    if (router.isReady) {
      const { playerId } = router.query
      setPlayerId(playerId as string)
    }
  }, [router])

  const getDkPlusPlanId = () => {
    return selectedPlanType === "annual" ? "adkplus" : "mdkplus"
  }

  const getDkPlusBundlePlanId = () => {
    return selectedPlanType === "annual" ? "adkplusbundle" : "mdkplusbundle"
  }

  const updateSelectedPlanType = (planType: string) =>
    setSelectedPlanType(planType)

  return (
    <>
      <Modal
        show={true}
        onHide={() => modelCloseHandler()}
        backdrop="static"
        contentClassName="blackBack"
      >
        <Modal.Header closeButton className="whiteText">
          <Modal.Title>Subscription Info</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="dksub_outer">
            {!isAuthenticated && (
              <div>
                Already a member?<br></br>
                <Link
                  href={`${domain}/MyPg/signin.aspx?referrer=${domain}/Players/Playerprofile.aspx?ID=${playerId}`}
                  target="_parent"
                  className="btn btn-outline-dark buttonFont buttonWhite"
                >
                  Sign in
                </Link>
              </div>
            )}

            <span className="title_lg">Become a Member Today</span>

            <span className="description">
              Access Video Highlights, Advanced Statistics & More Exclusive
              Content
            </span>

            <div className="case">
              <div className="levels">Best Value</div>
              <Image
                src="https://dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com/638018820732505332-DiamondKastPlusStats350x45.png"
                alt="https://dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com/638018820732505332-DiamondKastPlusStats350x45.png"
                className="img-fluid logo"
                width={500}
                height={500}
              />

              <div className="row">
                <div className="col-12 col-lg-7">
                  <ul>
                    <li>
                      <strong>Player Video Highlights & Video-on-Demand</strong>
                    </li>
                    <li>
                      <strong>Advanced Statistics</strong>
                    </li>
                    <li>Live Stats and Streaming</li>
                    <li>Play-by-Play</li>
                    <li>Game Recaps</li>
                    <li>Leaderboards</li>
                    <li>Team Stats</li>
                    <li>College Content</li>
                  </ul>
                </div>

                <div className="col-12 col-lg-5">
                  <div className="tabcont">
                    <Tabs
                      defaultActiveKey={1}
                      id="DiamondKastPlus"
                      className="dksubtabs"
                      fill
                    >
                      <Tab eventKey={1} title="Yearly">
                        <div className="DKtabcontainer">
                          <span className="pricing_pre">$</span>
                          <span className="pricing">15.99</span>
                          <span className="pricing_post">/mo</span>
                          <span className="pricing_note">
                            With Annual Subscription
                          </span>
                        </div>
                        <div className="d-grid">
                          {/* <button type="button" className="btn btn-dark buttonFont">
                      Subscribe Now
                    </button> */}
                          {/* change word to read Upgrade Now if they have regular DK already  */}
                          <Link
                            href={`${domain}/PGCart.aspx?addon=adkplus&referrer=${domain}/Players/Playerprofile.aspx?ID=${playerId}`}
                            target="_parent"
                            className="btn btn-dark buttonFont"
                          >
                            {user?.hasAccessToDk && " Upgrade Now"}
                            {!user?.hasAccessToDk &&
                              !user?.hasAccessToDkPlus &&
                              "Subscribe Now"}
                          </Link>
                        </div>
                      </Tab>
                      <Tab eventKey={2} title="Monthly">
                        <div className="DKtabcontainer">
                          <span className="pricing_pre">$</span>
                          <span className="pricing">19.99</span>
                          <span className="pricing_post">/mo</span>
                          <span className="pricing_note">
                            With Monthly Subscription
                          </span>
                        </div>
                        <div className="d-grid">
                          {/* <button type="button" className="btn btn-dark buttonFont">
                      Subscribe Now
                    </button> */}
                          {/* change word to read Upgrade Now if they have regular DK already  */}
                          <Link
                            href={`${domain}/PGCart.aspx?addon=mdkplus&referrer=${domain}/Players/Playerprofile.aspx?ID=${playerId}`}
                            target="_parent"
                            className="btn btn-dark buttonFont"
                          >
                            {user?.hasAccessToDk && " Upgrade Now"}
                            {!user?.hasAccessToDk &&
                              !user?.hasAccessToDkPlus &&
                              "Subscribe Now"}
                          </Link>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>

            <div className="case nomargin">
              <div className="levels">Bundle & Save</div>
              <Image
                src="https://dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com/638102573870665894-dkpxch.png"
                alt="https://dcb80a363a4153137b52-e3e81376f7ea45aa66e55c5aeb0ba59e.ssl.cf1.rackcdn.com/638102573870665894-dkpxch.png"
                className="img-fluid logo"
                width={500}
                height={500}
              />

              <div className="row">
                <div className="col-12 col-lg-7">
                  <ul>
                    <li>
                      <strong>HS & College Rankings</strong>
                    </li>
                    <li>
                      <strong>Scout Notes</strong>
                    </li>
                    <li>
                      <strong>Draft Prospect Reports</strong>
                    </li>
                    <li>
                      <strong>Advanced Player Search</strong>
                    </li>
                    <li>Player Video Highlights & Video-on-Demand</li>
                    <li>Advanced Statistics</li>
                    <li>Live Stats and Streaming</li>
                    <li>Play-by-Play</li>
                    <li>Game Recaps</li>
                    <li>Leaderboards</li>
                    <li>Top Performers</li>
                    <li>Team Stats</li>
                    <li>College Content</li>
                  </ul>
                </div>

                <div className="col-12 col-lg-5">
                  <div className="tabcont">
                    <Tabs
                      defaultActiveKey={1}
                      id="DiamondKastPlusBundle"
                      className="dksubtabs"
                      fill
                    >
                      <Tab eventKey={1} title="Yearly">
                        <div className="DKtabcontainer">
                          <span className="pricing_pre">$</span>
                          <span className="pricing">29.99</span>
                          <span className="pricing_post">/mo</span>
                          <span className="pricing_note">
                            With Annual Subscription
                          </span>
                        </div>
                        <div className="d-grid">
                          {/* <button
                      type="button"
                      className="btn btn-outline-dark buttonFont"
                    >
                      Subscribe Now
                    </button> */}
                          <Link
                            href={`${domain}/PGCart.aspx?addon=adkplusbundle&referrer=${domain}/Players/Playerprofile.aspx?ID=${playerId}`}
                            target="_parent"
                            className="btn btn-outline-dark buttonFont buttonWhite"
                          >
                            Subscribe Now
                          </Link>
                        </div>
                      </Tab>
                      <Tab eventKey={2} title="Monthly">
                        <div className="DKtabcontainer">
                          <span className="pricing_pre">$</span>
                          <span className="pricing">39.99</span>
                          <span className="pricing_post">/mo</span>
                          <span className="pricing_note">
                            With Monthly Subscription
                          </span>
                        </div>
                        <div className="d-grid">
                          {/* <button
                      type="button"
                      className="btn btn-outline-dark buttonFont"
                    >
                      Subscribe Now
                    </button> */}
                          <Link
                            href={`${domain}/PGCart.aspx?addon=mdkplusbundle&referrer=${domain}/Players/Playerprofile.aspx?ID=${playerId}`}
                            target="_parent"
                            className="btn btn-outline-dark buttonFont buttonWhite"
                          >
                            Subscribe Now
                          </Link>
                        </div>
                      </Tab>
                    </Tabs>
                  </div>
                </div>
              </div>
            </div>

            <span className="title_bottom">Join Today</span>
            <div className="row bottominfo">
              <div className="col">
                <ul>
                  <li>Live Game Coverage</li>
                  <li>Follow Your Favorite Players</li>
                  <li>View/Manage Player Video Highlights</li>
                  <li>Explore Advanced Statistics</li>
                  <li>And Much More</li>
                </ul>
              </div>
              <div className="col">
                <div className="d-grid">
                  {/* <button
                    type="button"
                    className="btn btn-outline-dark buttonFont buttonWhite"
                  >
                    Subscribe Now
                  </button> */}
                  <Link
                    href={`${domain}/Registration/Compare.aspx?sbsc=dk&referrer=${domain}/Players/Playerprofile.aspx?ID=${playerId}`}
                    target="_parent"
                    className="btn btn-outline-dark buttonFont buttonWhite"
                  >
                    Learn More
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </>
  )
}

export default DKPlusSubscriptionAlert
