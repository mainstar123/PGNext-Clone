import { AxiosResponse } from "axios"
import { useState } from "react"
import { Button, Form, Modal } from "react-bootstrap"
import { useForm } from "react-hook-form"
import styles from "../../../styles/Login.module.scss"
// import { alertServices } from "../../services/alert-service";
// import { apiService } from "../../services/api-services/common-api-service";
import { localStorageService, alertServices, apiService } from "../../services"
import { API_URLS } from "../../constants"
import { useAuth } from "@/context/auth"

const Login = (props: any) => {
  const [show, setShow] = useState(false)
  const handleClose = () => setShow(false)
  const handleShow = () => setShow(true)
  const { login } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors },
    // setValue,
    // reset,
    // getValues
  } = useForm({
    mode: "all",
  })

  const loginClickHandler = (formData: any) => {
    apiService.common
      .postFormUrlEncoded(API_URLS.GetAccessToken, {
        username: formData.email,
        password: formData.password,
        grant_type: "password",
      })
      .then((response: AxiosResponse) => {
        localStorageService.trySetUserAuthInfo(response)
        handleClose()
        login()
        alertServices.success(
          "Now you are logged in,  please use continue to using the PGNext site!"
        )
      })
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Login
      </Button>
      <Modal show={show} onHide={handleClose} backdrop="static">
        <Modal.Header closeButton className="text-center">
          <Modal.Title>Login</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className={styles["auth-form-container"]}>
            <Form
              className={styles["auth-form"]}
              onSubmit={handleSubmit(loginClickHandler)}
            >
              <div className={styles["auth-form-content"]}>
                <div>
                  <small>Please use your Perfect Game account to login</small>
                </div>
                <div className="form-group mt-1">
                  <label className={styles["form-label"]}>Email address</label>
                  <Form.Control
                    type="email"
                    {...register("email", { required: true, maxLength: 255 })}
                    className="mt-1"
                    placeholder="Enter email"
                  />
                  {(errors?.email?.type === "required" ||
                    errors?.email?.type === "validate") && (
                    <div className="text-danger pl-4 mb-2">
                      <small>Email is required</small>
                    </div>
                  )}
                </div>
                <div className="form-group mt-3">
                  <label className={styles["form-label"]}>Password</label>
                  <Form.Control
                    type="password"
                    {...register("password", {
                      required: true,
                      maxLength: 50,
                    })}
                    className="form-control mt-1"
                    placeholder="Enter password"
                  />
                  {(errors?.password?.type === "required" ||
                    errors?.password?.type === "validate") && (
                    <div className="text-danger pl-4 mb-2">
                      <small>Email is required</small>
                    </div>
                  )}
                </div>
                <div className="d-grid gap-2 mt-3">
                  <Button variant="primary" type="submit">
                    Login
                  </Button>
                </div>
              </div>
            </Form>
          </div>
        </Modal.Body>

        <Modal.Footer>
          {/* <div className="d-grid gap-2 mt-3">
            <Button variant="primary">Login</Button>
          </div> */}
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default Login
