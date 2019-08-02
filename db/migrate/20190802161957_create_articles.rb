class CreateArticles < ActiveRecord::Migration[5.2]
  def change
    create_table :articles do |t|
      t.boolean :draft
      t.references :user, foreign_key: true
      t.text :content
      t.date :last_edited
      t.string :tags
      t.string :title

      t.timestamps
    end
  end
end
