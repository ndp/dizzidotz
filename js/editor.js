const editorPegs$       = new Rx.BehaviorSubject([])
const editorPegsCmdBus$ = newCmdBus$(editorPegs$)
