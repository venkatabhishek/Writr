# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:profile, :articles]

  def articles
    @signed_in = user_signed_in?
    @articles = current_user.articles
  end

  def profile
    @signed_in = user_signed_in?
  end
end
