class AddDisplayImageToArticles < ActiveRecord::Migration[5.2]
  def change
    add_column :articles, :display_image, :string
  end
end
