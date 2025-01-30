function status(request, response) {
  response.status(200).json({ login: "juan" });
}
export default status;
