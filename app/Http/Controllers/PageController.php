<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PageController extends Controller
{
    public function about()
    {
        return Inertia::render('Static/About');
    }

    public function contact()
    {
        return Inertia::render('Static/Contact');
    }

    public function editorialPolicy()
    {
        return Inertia::render('Static/EditorialPolicy');
    }

    public function factCheckingPolicy()
    {
        return Inertia::render('Static/FactCheckingPolicy');
    }

    public function privacy()
    {
        return Inertia::render('Static/Privacy');
    }

    public function terms()
    {
        return Inertia::render('Static/Terms');
    }

    public function search()
    {
        return Inertia::render('Search/Index');
    }
}
