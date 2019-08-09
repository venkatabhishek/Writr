# frozen_string_literal: true

class UsersController < ApplicationController
  before_action :authenticate_user!, only: [:profile, :articles]

  def articles
    @articles = current_user.articles
  end

  def profile
  end
end
