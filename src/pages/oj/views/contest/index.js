const ContestList = () => import(/* webpackChunkName: "contest" */ './ContestList.vue')
const ContestDetails = () => import(/* webpackChunkName: "contest" */ './ContestDetail.vue')
const ContestProblemList = () => import(/* webpackChunkName: "contest" */ './children/ContestProblemList.vue')
const ContestRank = () => import(/* webpackChunkName: "contest" */ './children/ContestRank.vue')
const ACMContestHelper = () => import(/* webpackChunkName: "contest" */ './children/ACMHelper.vue')
const ContestChoice = () => import(/* webpackChunkName: "contest" */ './children/choiceContest')
const ContestBlank = () => import(/* webpackChunkName: "contest" */ './children/blankContest')
const ContestChoiceandBlankScore = () => import(/* webpackChunkName: "contest" */ './children/choiceandbalnkscore')
export {ContestDetails, ContestList, ContestProblemList, ContestRank, ACMContestHelper, ContestChoice, ContestBlank, ContestChoiceandBlankScore}
