import React from "react"
import { useState, useEffect } from "react"
import DisplayRepo from "./DisplayRepo"
import { fetchApiData } from "./utils/fetchApiData"

const userName = "d-lil"




const GetRepo = ({
  numOfrepos,
  showStars,
  showLanguage
}) => {
const [repoData, setRepoData] = useState([])
useEffect(() => {
  fetchApiData(userName).then(setRepoData)
}, [userName])
return (
  <DisplayRepo
    showLanguage={showLanguage}
    showStars={showStars}
    numOfrepos={numOfrepos}
    repoData={repoData}
  />
)
}

export default GetRepo;
