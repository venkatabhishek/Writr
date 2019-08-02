class HomeController < ApplicationController

  def index
    @signed_in = user_signed_in?
  end
end
