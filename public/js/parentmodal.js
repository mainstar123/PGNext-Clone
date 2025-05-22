// function to open modal in parent window, this is used for the subscription modal
// the message payload is the id of the modal to open on the parent window
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function openModal(target) {
  var parentModalId = "#subscriptionModal"
  window.parent.postMessage(
    {
      func: "openBootstrapModal",
      message: parentModalId,
    },
    target
  )
}
