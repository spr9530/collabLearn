export const checkUser = (token) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('http://localhost:5000/app/v1/user/checkUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
            })

            const data = await response.json()
            resolve({ data });
        } catch (error) {
            reject({ error });
        }
    })
}

export const userLogginApi = (userCredentials) => {
    return new Promise(async (resolve, reject) => {
        try {
            const response = await fetch('http://localhost:5000/app/v1/user/logginUser', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userCredentials)
            });

            if (!response.ok) {
                const errorData = await response.json();
                reject({ error: errorData });
            } else {
                const data = await response.json();
                resolve({ data });
            }
        } catch (error) {
            reject({ error: 'Internal server error' });
        }
    });
}

export const getUserInfo = async () => {
    const token = localStorage.getItem('token')
    try {
        if (!token) {
            throw new Error('Please Login First')
        }
        const response = await fetch('http://localhost:5000/app/v1/user/getUserInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
        })

        const { userInfo } = await response.json();
        return userInfo
    } catch (error) {
        console.log({ error })
    }
}

export const updateUserApi = async (rooms) => {
    const token = localStorage.getItem('token')
    try{
        const updateUser = await fetch('http://localhost:5000/app/v1/user/updateUser', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                rooms
            })
        })
        const data = await updateUser.json()
        return ({data})
    }catch(error){
        console.log(error)
    }
}