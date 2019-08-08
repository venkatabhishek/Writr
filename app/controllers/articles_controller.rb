# frozen_string_literal: true
require 'json'

class ArticlesController < ApplicationController
  before_action :authenticate_user!, only: [:new]

  def new
    @signed_in = user_signed_in?
  end

  def create
    @signed_in = user_signed_in?
    article = current_user.articles.create(article_params)
    article.save

    render json: { id: article.id }
  end

  def update
    @article = Article.find(params[:id])

    if @article.update(article_params)
      render json: { status: 1 }
    else
      render json: { status: 0 }
    end
end

  def edit
    @signed_in = user_signed_in?
    @article = Article.find(params[:id])
  end

  def content
    @article = Article.find(params[:id])

    render json: { content: @article.content }
  end

  def destroy
    article = Article.find(params[:id])
    article.destroy

    render json: { status: 1 }
  end

  private

  def article_params
    params.require(:article).permit(:content)
  end
end
