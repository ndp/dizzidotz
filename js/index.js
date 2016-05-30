"use strict";

const savedProjects$ = Rx.Observable.range(0, localStorage.length)
    .map((x) => localStorage.key(x))
    .filter((x) => /project.*/.exec(x))
    .map((x) => localStorage.getItem(x))
    .map((x) => JSON.parse(x))
    .reduce((acc, x) => {
      acc.push(x)
      return acc
    }, [])
    .map((x) => x.sort((a, b) => b.timestamp - a.timestamp))

const newProjects$ = new Rx.Subject()

newProjects$.subscribe((project) => {
  project.timestamp = (new Date()).getTime()
  project.name = `project-${project.timestamp}`
  localStorage.setItem(project.name, JSON.stringify(project))
})

const allProjects$ = Rx.Observable.combineLatest(savedProjects$, newProjects$.startWith(null), (savedProjects, newProject) => {
      if (newProject) savedProjects.unshift(newProject)
      return savedProjects
    })

const projectList = document.getElementsByTagName('ol')[0]

const renderProject = (e) => {

  const link = e.target.closest('a')
  if (!link) return;

  clearProject()

  const pegData = link.getAttribute('data-pegs')
  const pegs = JSON.parse(pegData)
  pegs.forEach((pegModel) => {
    newPeg(radius, pegModel.pt, pegModel.size)
    renderPeg(pegModel)
  })
}


const projectClicks$ = Rx.Observable.fromEvent(projectList, 'click')
projectClicks$.subscribe(renderProject)


const drawProjects = (projects) => {
  projectList.innerHTML = ''

  projects.forEach((project) => {
    const link = document.createElement('A')
    link.style.height = '100px'
    link.style.width = '100px'
    link.style.display = 'block'
    link.innerHTML = project.svg
    link.setAttribute('data-pegs', JSON.stringify(project.pegs))
    projectList.appendChild(link)
  })
}

allProjects$.subscribe((x) => {
  drawProjects(x)
})

