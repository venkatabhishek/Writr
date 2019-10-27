# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users, path: '', path_names: { sign_in: 'login', sign_up: 'register', sign_out: 'logout'}

  resources :articles

  get '/me/articles', to: 'users#articles'
  get '/profile', to: 'users#profile'
  get '/articles/:id/content', to: 'articles#content'
  get '/articles/search', to: "articles#image"

  root to: 'home#index'
end
