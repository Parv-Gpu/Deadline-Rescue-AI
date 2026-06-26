function DependencyGraph({ tasks }) {

const subtasks=tasks.filter(x=>x.task_type!=="parent");

return(

<section className="premium-card">

<p className="eyebrow">Dependencies</p>

<h3>Task Flow</h3>

<div className="dependency-flow">

{subtasks.map((task,index)=>(

<div key={index} className="dependency-node">

<div className="node-circle">

{index+1}

</div>

<p>{task.task_name}</p>

{index!==subtasks.length-1 &&

<div className="dependency-line"></div>

}

</div>

))}

</div>

</section>

)

}

export default DependencyGraph;