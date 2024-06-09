import Axios from "axios"

export const fetchApiData = async (username) => {
  const response = await Axios.get(
    `https://api.github.com/users/${username}/repos?type=public`
  )
  return response.data
}