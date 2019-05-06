import Vue from 'vue'
import VueRouter from 'vue-router'
// 引入 view 组件
import { Announcement, Conf, Contest, ContestList, Home, JudgeServer, Login, CreateChoice, CreateBlank, ChoicesList, BlankList,
  Problem, ProblemList, ChoiceList, User, PruneTestCase, Dashboard, ProblemImportOrExport, Help } from './views'
Vue.use(VueRouter)

export default new VueRouter({
  mode: 'history',
  base: '/admin/',
  scrollBehavior: () => ({y: 0}),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/help',
      component: Home,
      children: [
        {
          path: '',
          name: 'help',
          component: Help

        }
      ]
    },
    {
      path: '/',
      component: Home,
      children: [
        {
          path: '',
          name: 'dashboard',
          component: Dashboard
        },
        {
          path: '/announcement',
          name: 'announcement',
          component: Announcement
        },
        {
          path: '/user',
          name: 'user',
          component: User
        },
        {
          path: '/conf',
          name: 'conf',
          component: Conf
        },
        {
          path: '/judge-server',
          name: 'judge-server',
          component: JudgeServer
        },
        {
          path: '/prune-test-case',
          name: 'prune-test-case',
          component: PruneTestCase
        },
        {
          path: '/problems',
          name: 'problem-list',
          component: ProblemList
        },
        {
          path: '/problem/create',
          name: 'create-problem',
          component: Problem
        },
        {
          path: '/problem/edit/:problemId',
          name: 'edit-problem',
          component: Problem
        },
        {
          path: '/problem/batch_ops',
          name: 'problem_batch_ops',
          component: ProblemImportOrExport
        },
        {
          path: '/choice',
          name: 'choice-list',
          component: ChoicesList
        },
        {
          path: '/choice/create',
          name: 'create-choice',
          component: CreateChoice
        },
        {
          path: '/blank',
          name: 'blank-list',
          component: BlankList
        },
        {
          path: '/blank/create',
          name: 'create-blank',
          component: CreateBlank
        },
        {
          path: '/contest/create',
          name: 'create-contest',
          component: Contest
        },
        {
          path: '/contest',
          name: 'contest-list',
          component: ContestList
        },
        {
          path: '/contest/:contestId/edit',
          name: 'edit-contest',
          component: Contest
        },
        {
          path: '/contest/:contestId/announcement',
          name: 'contest-announcement',
          component: Announcement
        },
        {
          path: '/contest/:contestId/problems',
          name: 'contest-problem-list',
          component: ProblemList
        },
        {
          path: '/contest/:contestId/choice',
          name: 'contest-problem-choice',
          component: ChoiceList
        },
        {
          path: '/contest/:contestId/problem/create',
          name: 'create-contest-problem',
          component: Problem
        },
        {
          path: '/contest/:id/choice/create',
          name: 'create-contest-choice',
          component: CreateChoice
        },
        {
          path: '/contest/choice/edit',
          name: 'edit-contest-choice',
          component: CreateChoice
        },
        {
          path: '/contest/blank/edit',
          name: 'edit-contest-blank',
          component: CreateBlank
        },
        {
          path: '/blank/edit',
          name: 'edit-blank',
          component: CreateBlank
        },
        {
          path: '/choice/edit',
          name: 'edit-choice',
          component: CreateChoice
        },
        {
          path: '/contest/:id/blank/create',
          name: 'create-contest-blank',
          component: CreateBlank
        },
        {
          path: '/contest/:contestId/problem/:problemId/edit',
          name: 'edit-contest-problem',
          component: Problem
        }
      ]
    },
    {
      path: '*', redirect: '/login'
    }
  ]
})
