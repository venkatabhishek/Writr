# frozen_string_literal: true
require 'json'
require 'unsplash'

class ArticlesController < ApplicationController
  before_action :authenticate_user!, only: [:new, :edit]

  def new
    @publishable = true
  end

  def create
    @article = current_user.articles.create(article_params)
    @article.save

    render json: { id: @article.id }
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
    @publishable = true
    @article = Article.find(params[:id])
    if(@article.user_id != current_user.id)
        redirect_to root
    end
  end

  def show
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

  def show
    @article = Article.find(params[:id])

    if(@article.draft)
      redirect_to root
    end
      
  end

  def image
    q = params['q']
    page = params['page'] || 1

    search_results = Unsplash::Photo.search(q, page, 5)

    search_results.map! { |obj| obj.as_json['attributes']['table']}

    render json: { results: search_results }

  end

  private

  def article_params
    params.require(:article).permit(:content, :title, :subtitle, :tags, :draft)
  end
end
