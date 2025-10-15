<?php

namespace App\Containers\AppSection\History\Tasks;

use App\Containers\AppSection\History\Data\Repositories\HistoryRepository;
use App\Containers\AppSection\History\Models\History;
use App\Ship\Exceptions\CreateResourceFailedException;
use App\Ship\Parents\Models\Model;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\Auth;

class CreateHistoryTask extends ParentTask
{
    public function __construct(
        protected readonly HistoryRepository $repository,
    ) {
    }

    /**
     * @throws CreateResourceFailedException
     */
    public function run(Model $model, string $type): History
    {

        try {
            $originalModel = $this->getOriginalModel($model);

            $data = [
                'model_type' => get_class($model),
                'model_id' => $model->id,
                'before_changes' => $originalModel,
                'after_changes' => $model->fresh(),
                'changes' => $this->getAttributesChanges($model, $originalModel),
                'change_type'    => $type,
                'user_id' => Auth::user()->id
            ];

            return $this->repository->create($data);
        } catch (\Exception) {
            throw new CreateResourceFailedException();
        }
    }

    protected function getOriginalModel(Model $model)
    {
        $originalModel = clone $model;
        foreach ($model->getAttributes() as $key => $afterValue) {
            $beforeValue         = $model->getOriginal($key);
            $originalModel->$key = $beforeValue;
        }

        return $originalModel;
    }

    protected function getAttributesChanges(Model $model, ?Model $originalModel = null): Collection
    {
        $originalModel     = $originalModel ? : $this->getOriginalModel($model);
        $attributesChanges = collect();

        $changes = $model->getChanges();
        foreach ($changes as $key => $afterValue) {
            $change = [
                'before' => $originalModel->$key,
                'after'  => $model->$key,
            ];
            $attributesChanges->put($key, $change);
        }

        return $attributesChanges;
    }
}
