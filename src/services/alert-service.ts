import Swal from "sweetalert2";

// TODO: Should be used only inside of this service
const swalAlert = (title = "", message: string, alertIcon: any) => {
  return Swal.fire({
    title: title,
    allowOutsideClick: false,
    icon: alertIcon,
    html: message
  });
}

const swalConfirmWithTitle = (title: string, message: string) => {
    return Swal.fire({
      title: title,
      text: message,
      allowOutsideClick: false,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: 'No',
      confirmButtonText: 'Yes'
    });
  }

const confirm = (title: string, message: string) => swalConfirmWithTitle(title, message);
const success = (message: string, title = "",) => swalAlert(title, message, 'success');
const warning = (message: string, title = "",) => swalAlert(title, message, 'warning');
const info = (message: string, title = "",) => swalAlert(title, message, 'info');
const error = (message: string, title = "",) => swalAlert(title, message, 'error');

export const alertServices = {
    success,
    warning,
    error,
    info,
    confirm,
}