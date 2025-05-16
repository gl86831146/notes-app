import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Register from '@/pages/Register';
import Login from '@/pages/Login';
import Home from '@/pages/Home';
import Categories from '@/pages/Categories';  
import CategoryNotes from '@/pages/CategoryNotes';
import Notes from '@/pages/Notes';
import Note from '@/pages/Note';
import CreateNote from '@/pages/CreateNote';
import EditNote from '@/pages/EditNote';
import AIWrite from '@/pages/AIWrite';
import Favorites from '@/pages/Favorites';
import RecycleBin from '@/pages/RecycleBin';   

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/notes/categories/:categoryId" element={<CategoryNotes />} /> 
            <Route path="/notes" element={<Notes />} />
            <Route path="/notes/:id" element={<Note />} />
            <Route path="/create-note" element={<CreateNote />} />
            <Route path="/notes/edit/:noteId" element={<EditNote />} />
            <Route path="/ai-write" element={<AIWrite />} />
            <Route path="/favorites" element={<Favorites />} />
            <Route path="/recycle-bin" element={<RecycleBin />} />
        </Routes>
    );
};

export default AppRoutes;