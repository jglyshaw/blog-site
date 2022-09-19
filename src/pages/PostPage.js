import Post from "../components/Post";
import PostForm from '../components/PostForm';
import Confirmation from "../components/Confirmation";
import { Card, Snackbar, Grid, CircularProgress, Dialog, Button } from '@mui/material/';
import { createPost, editPost, getPosts, deletePost, likePost } from "../api/routes";
import { useDispatch, useSelector } from 'react-redux'
import { useState } from "react";
import { setPosts, setCurrentID } from '../redux/posts'

function PostPage() {
    const backdrop = {
        backgroundColor: '#ecf0f1',
        fontFamily: 'sans-serif',
        padding: '50px',
        textAlign: 'center',
        minHeight: '200px'
    }

    const posts = useSelector((state) => state.postReducer.value)
    const currentID = useSelector((state) => state.postReducer.currentID)
    const [showEdit, setShowEdit] = useState(false);
    const [showDelete, setShowDelete] = useState(false);
    const [showCreate, setShowCreate] = useState(false);
    const [showSnack, setShowSnack] = useState(false);
    const [snackText, setSnackText] = useState("");
    const dispatch = useDispatch()

    const deletePostById = async () => {
        setSnackText("Post deleted")
        setShowSnack(true)
        await deletePost(currentID)
        setShowDelete(false);
        reload()
    }

    const likePostById = async (id) => {
        setSnackText("Liked Post")
        setShowSnack(true)
        await likePost(id)
        reload()
    }

    const onAddPost = async (title, description, image, tags) => {
        setShowCreate(false)
        setSnackText("Post created")
        setShowSnack(true)
        await createPost({
            title: title,
            description: description,
            image: image,
            tags: tags
        })
        reload()
    }

    const reload = async () => {
        const result = await getPosts()
        dispatch(setPosts(result.data))
    }

    const onEditPost = async (title, description, image, tags) => {
        setSnackText("Updated post")
        setShowSnack(true)
        await editPost(currentID, {
            title: title,
            description: description,
            image: image,
            tags: tags
        })
        setShowEdit(false)
        reload()
    }

    return (
        <div style={backdrop}>
            <Card style = {{marginBottom: "30px"}}>
                <Grid container
                    direction="row"
                    justifyContent="center"
                    alignItems="center" 
                >
                    <Grid item sm={12} md = {4}> <h3>Your Posts</h3> </Grid>
                    <Grid item sm={12} md = {4}><Button variant="contained" onClick={() => {dispatch(setCurrentID(0)); setShowCreate(true)}}>
                        Create new Post</Button></Grid>
                    <Grid item sm={12} md = {4}> {posts !== null && <h3>Posts: {posts.length} </h3>} </Grid>
                </Grid>
            </Card>

            <Snackbar
                open={showSnack}
                onClose={() => setShowSnack(false)}
                autoHideDuration={2000}
                message={snackText}
            />

            <Confirmation onClose={() => setShowDelete(false)} onDelete={deletePostById} open={showDelete} />

            <Dialog open={showCreate} onClose={() => setShowCreate(false)}>
                <h1 style={{ textAlign: "center" }}>Create Post</h1>
                <PostForm onSubmitCall={onAddPost} />
            </Dialog>

            <Dialog open={showEdit} onClose={() => setShowEdit(false)}>
                <h1 style={{ textAlign: "center" }}>Edit Post</h1>
                <PostForm onSubmitCall={onEditPost} />
            </Dialog>

            {posts === null && <CircularProgress />}
            {posts !== null && posts.length === 0 && <h3>You haven't created any posts</h3>}

            <Grid container alignItems="center">
                {posts !== null && posts.map((post, id) => (
                    <Grid item key={id} xs={12} sm={6} md={4} style={{ padding: "10px" }}>
                        <Post
                            onDelete={() => {setShowDelete(true); dispatch(setCurrentID(post._id))}}
                            onLike={likePostById}
                            onEdit={() => {setShowEdit(true); dispatch(setCurrentID(post._id))}}
                            id={post._id}  />
                    </Grid>
                ))}
            </Grid>
        </div>
    );
}

export default PostPage;