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

            resolve({ data })
        } catch (error) {
            reject({ error })
        }
    })
}

export const getRoomData = (roomCode) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch(`http://localhost:5000/app/v1/room/${roomCode}`)
            if (!response.ok) {
                reject({ error: 'erro in reponse' })
            }

            const data = await response.json();
            resolve( data );
        } catch (error) {
            reject({ error })
        }
    })
}

export const updateRoomUsers = ({ id, users }) => {
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
            console.log(roomCode)
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