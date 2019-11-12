# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: '', path_names: { sign_in: 'login', sign_up: 'register', sign_out: 'logout'}


  get '/me/articles', to: 'users#articles'
  get '/@:user', to: 'users#profile'
  get '/articles/search', to: "articles#image"
  get '/articles/:id/content', to: 'articles#content'
  
  resources :articles

  root to: 'home#index'
end
