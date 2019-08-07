# frozen_string_literal: true

Rails.application.routes.draw do
  devise_for :users
  devise_scope :user do
    get 'login', to: 'devise/sessions#new'
    get 'register', to: 'devise/sessions#create'
  end

	get 'me/articles', to: 'users#articles'
  get 'profile', to: 'users#profile'

  resources :articles

  root to: 'home#index'
end
