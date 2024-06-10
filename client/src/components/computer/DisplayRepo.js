import React from "react"
import { removeDash } from "./utils/removeDash"
import { sortByMostRecentDate } from "./utils/sortByMostRecentDate"
import { convertToHours } from "./utils/convertToHours"
import { getRemainingSeconds } from "./utils/getRemainingSeconds"
import "../computer/css/Github.css"
import Star from "../computer/assets/mp4_logo.png"
import { arrayToLength } from "./utils/arrayToLength"


const DisplayRepo = ({ repoData, userName, numOfrepos, showStars, showLanguage }) => {

    const sortedRepos = sortByMostRecentDate(repoData)
    const sortedAndReducedRepos = arrayToLength(sortedRepos, numOfrepos)
    return (
      <div className="repoContainer">
        <h1 className="github-intro"><u>List Does Not Include Private Repos</u></h1>
        <a href="https://www.github.com/d-lil" target="_blank" rel="noopener noreferrer" className="github-intro-a">Click Here To View Github Page</a>
        <h2 className="github-intro2"><marquee>Link opens in new browser window outside of this page</marquee></h2>
        <hr />
        {sortedAndReducedRepos
          ? sortedAndReducedRepos.map((repo) => (
              <ul key={repo.id}>
                <li>
                  <a
                    id='github-title'
                    className="github-title"
                    href={repo.html_url}
                    target='_blank'
                    rel='noopener noreferrer'
                  >
                    {removeDash(repo.name)}
                  </a>
                </li>
                <li id='description' className="description">
                  {repo.description}
                </li>
                <div id='options' className="options">
                  {showLanguage ? (
                    <li id='language' className="languages">
                      {repo.language}
                    </li>
                  ) : null}
                  {showStars ? (
                    <li>
                      <img src={Star} alt='star' className="star" />
                      {repo.stargazers_count}
                    </li>
                  ) : null}
                </div>
                <li id='text-updated' className="text-updated">
                  updated{" "}
                  {convertToHours(
                    getRemainingSeconds(new Date(repo.updated_at), Date.now())
                  )}
                </li>
              </ul>
            ))
          : null}
      </div>
    )
  }

export default DisplayRepo