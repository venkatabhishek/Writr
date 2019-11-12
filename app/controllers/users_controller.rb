# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:profile, :articles]

  def articles
    @articles = current_user.articles
  end

  def profile
    @user = User.find_by username: params[:user]
    render 'profile'
  end
end
