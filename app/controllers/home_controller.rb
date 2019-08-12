class HomeController < ApplicationController

  def index
    @articles = Article.where("draft = ?", false)
  end
end
