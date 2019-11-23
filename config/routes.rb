# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: '', path_names: { sign_in: 'login', sign_up: 'register', sign_out: 'logout'}


  get '/me/articles', to: 'users#articles'
  get '/search', to: 'home#search'
  get '/find', to: 'home#find'
  get '/@:user', to: 'users#profile'
  get '/articles/search', to: "articles#image"
  get '/articles/:id/content', to: 'articles#content'
  
  resources :articles do
    resources :comments
  end

  resources :comments do
    resources :comments
  end

  root to: 'home#index'
end
