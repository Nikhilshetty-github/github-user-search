const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

app.use(cors());

app.get('/users/:username', async (req, res) => {
    const username = req.params.username;
    const page = req.query.page || 1; 
    const perPage = 10; 
  
    try {
        const response = await axios.get(
        `https://api.github.com/search/users?q=${username}&sort=followers&page=${page}&per_page=${perPage}`
        );
        console.log(response.data.items.length);
        const users = await response.data.items;
        // const followersResponse = await axios.get(`https://api.github.com/users/${username}/followers`);
        res.json(users);
        // console.log(users);
    } catch (error) {
        res.status(404).json({ error: 'Users not found' });
    }
});

app.get('/followers/:username', async (req, res) => {
    const username = req.params.username;
    const token = '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'
    const headers = {
        Authorization: `Bearer ${token}`,
    };
    let page = 1;
    let followersCount = 0;

    // try {
    //     while (true) { 
    //         const response = await axios.get(`https://api.github.com/users/${username}/followers?page=${page}&per_page=1000`, { headers });
    //         const followers = await response.data;
    //         if (followers.length === 0) {
    //             break;
    //         }
    //         console.log(followers.length);
    //         followersCount += followers.length;
    //         page++;
    //     }
    //     res.json({followersCount});
    // } catch (error) {
    //     res.status(404).json({ error: 'Followers not found' });
    // }
    try {
        const query = `
            query {
            user(login: "${username}") {
                followers {
                    totalCount
                }
            }
            }
        `;

        const response = await axios.post('https://api.github.com/graphql', {
        query
        }, { headers });

        console.log(`${username}`, response.data.data.user?.followers?.totalCount || 0);
        return response.data.data.user?.followers?.totalCount || 0;
    } catch (error) {
        console.error('Error fetching followers count:', error);
        throw error;
    }
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
