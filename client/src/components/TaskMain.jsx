const TaskMain = ({ item }) => {
  return (
    <main className="task-item-main ">
      <h2 className="fs-x-large bold">{item.title}</h2>
      <p>{item.description}</p>
      {item.images.length > 0 ? (
        <div className="task-item-img flex">
          {item.images.map((img) => (
            <img key={img} src={img} alt={`Imagen de la tarea ${item.title}`} />
          ))}
        </div>
      ) : (
        ""
      )}
    </main>
  );
};

export default TaskMain;
