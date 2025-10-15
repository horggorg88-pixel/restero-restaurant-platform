<?php

namespace App\Containers\AppSection\Table\Tasks;

use App\Containers\AppSection\Table\Data\Repositories\TableRepository;
use App\Containers\AppSection\Table\Events\TableUpdatedEvent;
use App\Containers\AppSection\Table\Models\Table;
use App\Ship\Exceptions\NotFoundException;
use App\Ship\Exceptions\UpdateResourceFailedException;
use App\Ship\Parents\Tasks\Task as ParentTask;
use Illuminate\Database\Eloquent\ModelNotFoundException;

class UpdateTableTask extends ParentTask
{
    public function __construct(
        protected readonly TableRepository $repository,
    ) {
    }

    /**
     * @throws NotFoundException
     * @throws UpdateResourceFailedException
     */
    public function run(array $data, $id): Table
    {
        try {
            $table = $this->repository->update($data, $id);
            TableUpdatedEvent::dispatch($table);

            return $table;
        } catch (ModelNotFoundException) {
            throw new NotFoundException();
        } catch (\Exception) {
            throw new UpdateResourceFailedException();
        }
    }
}
