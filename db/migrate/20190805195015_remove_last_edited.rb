class RemoveLastEdited < ActiveRecord::Migration[5.2]
  def change
    remove_column :articles, :last_edited
  end
end
