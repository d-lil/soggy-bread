import React from "react"
import styles from "./css/Github.css"
import GetRepo from "./GetRepo"

const Github = ({
  userName,
  numOfrepos,
  showStars,
  showLanguage
}) => {
  return (
    <div className={styles.container}>
      {" "}
      <GetRepo
        showStars={showStars}
        numOfrepos={numOfrepos}
        userName={userName}
        showLanguage={showLanguage}
      />
    </div>
  )
}

export default Github