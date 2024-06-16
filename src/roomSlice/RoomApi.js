
export const addRoomData = (data) => {
    return new Promise((resolve, reject) => {
        fetch('http://localhost:5000/api/v1/room/saveData', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                roomData: data
            })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                console.log(response.json())
                return response.json();
            })
            .then(data => {
                resolve(data);
            })
            .catch(error => {
                reject(error);
            });
    });
};

export const createRoomApi = (info) => {
    return new Promise(async (resolve, reject) => {
        try {
            const token = localStorage.getItem('token')
            const response = await fetch('http://localhost:5000/app/v1/room/createRoom', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(
                    info
                )
            })
            const data = await response.json()

            resolve( data )
        } catch (error) {
            reject({ error })
        }
    })
}

export const getRoomData = (roomId) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`http://localhost:5000/app/v1/room/${roomId}`)
            if (!response.ok) {
                reject({ error: await response.json() })
            }

            const data = await response.json();
            resolve( data );
        } catch (error) {
            reject({ error })
        }
    })
}

export const updateRoomUsers = ({ id2:id, users }) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`http://localhost:5000/app/v1/room/${id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ users })
            });

            const data = await response.json();
            resolve(data); 
        } catch (error) {
            reject(error); 
        }
    });
};



export const getRoomInfo = async(roomCode) => {
        try {
            const response = await fetch(`http://localhost:5000/app/v1/room/${roomCode}`)
            if (!response.ok) {
                return({ error: 'erro in reponse' })
            }

            const data = await response.json();
            return( data );
        } catch (error) {
            return({ error })
        }
}

export const createRoomFile = async({roomId, name, type}) =>{
    try{

        const token = localStorage.getItem('token')
        const createData = await fetch(`http://localhost:5000/app/v1/room/createData/${roomId}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                name,
                type
            })
        })

        const data = await createData.json()
        console.log(data)
        return;

    }catch(error){
        return ({error})
    }
}

export const getRoomFiles = async (roomId) => {
    try {
      const response = await fetch(`http://localhost:5000/app/v1/room/getRoomData/${roomId}`);
      
      if (!response.ok) {
        return{ error: `Error fetching room files: ${response.statusText}` };
      }
      
      const files = await response.json();
      return { files };
    } catch (error) {
      return { error: error.message };
    }
  };
  

export const getEditor = async(id) =>{
    try{
        console.log('called')
        const fetchEditor = await fetch(`http://localhost:5000/app/v1/room/getRoomEditor/${id}`)
        
        const data = await fetchEditor.json();
        
        return (data)

    }catch(error){
        return ({error})
    }
}

export const updateEditor = async({id, text:roomData}) =>{
    try{
        console.log(id, roomData)
        const update = await fetch(`http://localhost:5000/app/v1/room/updateRoomEditors/${id}`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                roomData
            })
        })

        const data = await update.json();

        return (data)


    }catch(error){
        return ({error})
    }
}