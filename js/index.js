const loadSavedProjects = () => {
  if (!localStorage['projects']) {
    localStorage['projects'] = "[{\"pegs\":[],\"svg\":\"<svg id=\\\"editor\\\" viewBox=\\\"0 0 904 904\\\" style=\\\"width: auto; height: auto; margin-left: auto;\\\"><circle id=\\\"wheel\\\" cx=\\\"452\\\" cy=\\\"452\\\" r=\\\"452\\\" stroke-width=\\\"0\\\" fill=\\\"url(#grad1)\\\"></circle><radialGradient id=\\\"grad1\\\" cx=\\\"50%\\\" cy=\\\"50%\\\" r=\\\"50%\\\" fx=\\\"50%\\\" fy=\\\"50%\\\"><stop offset=\\\"0%\\\" style=\\\"stop-color:mediumpurple;stop-opacity:1\\\"></stop><stop offset=\\\"10%\\\" style=\\\"stop-color:purple;stop-opacity:1\\\"></stop><stop offset=\\\"100%\\\" style=\\\"stop-color:slateblue;stop-opacity:1\\\"></stop></radialGradient></svg>\"}]"
  }
  return JSON.parse(localStorage['projects'])
}


const projectList = document.getElementsByTagName('ol')[0]



const loadProject = (e) => {

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
projectClicks$.subscribe(loadProject)



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

drawProjects(loadSavedProjects())


