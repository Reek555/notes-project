import './App.css';
import { useState , useEffect} from 'react';


if (!localStorage["notes"]) {
  localStorage.setItem("notes", "[]")
}


function App() {
  const [notes, setNotes] = useState([]);
  const [component, setComponent] = useState();
  const [activeNote, setActiveNote] = useState();


  useEffect(() => {
    setNotes(JSON.parse(localStorage['notes']))

  }, []); 


  function Preview ({note}) {

        const deleteHandler = () => {
              let ind = notes.findIndex(item => item.id == note.id)
              notes.splice(ind, 1)
              setNotes(notes);
              localStorage["notes"] = JSON.stringify(notes)
              setComponent()
        }

        const editHandler = () => {
              console.log(notes)
              setComponent(<NotesForm title = {note.title} content={note.content} id = {note.id} buttonText = "تعديل" />)
        }

        setActiveNote(note.id)
        
        return (
          <div id = "preview">
            <h2>{note.title}</h2>
            <p>{note.content}</p>
            <button id = "preview-edit-btn"  onClick={editHandler}>تعديل</button>
            <button id = "preview-delete-btn" onClick = {deleteHandler} >حذف</button>
          </div>
        )
  }

  function notesList () {

        const noteClickHandler = (clickedNote) => {
          setComponent(<Preview note = {clickedNote}/>)
        }

        let list = notes.map(note  => <li className= {"note-item" + (activeNote == note.id? " active": "")} onClick = { () => noteClickHandler(note)}> {note.title} </li>)
        return (
          <div id = "notes-list">
            {list}
          </div>
        )
  }

  function NotesForm ({buttonText, title, content, id}) {

        const saveHandler = () =>  {
              if (!(title && content)) {
                return alert("you can't leave an empty field!")
              }
              let newNote  = {id: new Date(), title, content}
              // error case 1:
              //setNotes([...notes, newNote])
              //setComponent(<Preview note = {newNote} />)
              let updatedNotes = notes
              updatedNotes.push(newNote)
              setNotes(updatedNotes);
              localStorage["notes"] = JSON.stringify(updatedNotes)
              setComponent(<Preview note = {newNote} />) 
        }


        const editHandler = () => {
              if (!(title && content)) {
                return alert("you can't leave an empty field!")
              }

              let ind = notes.findIndex(note => note.id == id);
 
              notes[ind].title = title;
              notes[ind].content = content;
              setNotes(notes)
              localStorage["notes"] = JSON.stringify(notes)
              setComponent(<Preview note = {notes[ind]}/>)
        }
        
        let handler, header;

        if (buttonText == "حفظ") {
          handler = saveHandler;
          header = "ملاحظة جديدة"
          setActiveNote()  //each occurence of this statement is the cause of the error in the terminal
        }
        else {
          handler = editHandler;
          header = "تعديل الملاحظة"
        }

        return (
          <div id="notes-form">
            <h2 id = "notes-form-header" >{header}</h2>
            <textarea placeholder = "العنوان" id = "notes-form-input1" onChange={ (event) => title = event.target.value} >{title}</textarea>
            <textarea placeholder = "النص" id = "notes-form-input2" onChange={ (event) => content = event.target.value}>{content}</textarea>
            <button id = "notes-form-button" onClick={handler}>{buttonText}</button>
          </div>
        )
  }


  return (
    <>
      <div id = "white-div">
          {notesList()}
          {component}
          <h2 id = "header"> {component? "" : notes.length > 0 ? "المرجو اختيار ملاحظة" : "لا توجد ملاحظة"}</h2>
      </div>
      <button id = "add-btn" onClick={() => setComponent(<NotesForm buttonText = 'حفظ' title = '' content = '' />)}>+</button>
    </>
  );
}

export default App;